from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from typing import Dict, Set
import json
import logging
from api.deps import get_current_user
from models.user import User

logger = logging.getLogger(__name__)

router = APIRouter()


class ConnectionManager:
    """Manage WebSocket connections."""
    
    def __init__(self):
        """Initialize connection manager."""
        self.active_connections: Dict[int, Set[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, user_id: int):
        """Accept and store a new WebSocket connection.
        
        Args:            websocket: WebSocket connection
            user_id: ID of the connected user
        """
        await websocket.accept()
        
        if user_id not in self.active_connections:
            self.active_connections[user_id] = set()
        
        self.active_connections[user_id].add(websocket)
        logger.info(f"User {user_id} connected. Total connections: {len(self.active_connections[user_id])}")
    
    def disconnect(self, websocket: WebSocket, user_id: int):
        """Remove a WebSocket connection.
        
        Args:
            websocket: WebSocket connection
            user_id: ID of the user
        """
        if user_id in self.active_connections:
            self.active_connections[user_id].discard(websocket)
            
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
            
            logger.info(f"User {user_id} disconnected")
    
    async def send_personal_message(self, message: dict, user_id: int):
        """Send a message to all connections of a specific user.
        
        Args:
            message: Message to send
            user_id: ID of the user
        """
        if user_id in self.active_connections:
            disconnected = set()
            
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    logger.error(f"Error sending message to user {user_id}: {e}")
                    disconnected.add(connection)
            
            # Remove disconnected connections
            for connection in disconnected:
                self.disconnect(connection, user_id)
    
    async def broadcast(self, message: dict):
        """Broadcast a message to all connected users.
        
        Args:
            message: Message to broadcast
        """
        for user_id, connections in self.active_connections.items():
            await self.send_personal_message(message, user_id)


# Global connection manager instance
manager = ConnectionManager()


@router.websocket("/ws/{token}")
async def websocket_endpoint(websocket: WebSocket, token: str):
    """WebSocket endpoint for real-time updates.
    
    Args:
        websocket: WebSocket connection
        token: JWT access token
    """
    try:
        # Validate token and get user
        # For now, accepting all connections (in production, validate the token)
        user_id = 1  # Placeholder - extract from token in production
        
        await manager.connect(websocket, user_id)
        
        try:
            while True:
                # Receive messages from client
                data = await websocket.receive_text()
                message = json.loads(data)
                
                # Echo back for testing
                await manager.send_personal_message(
                    {"type": "echo", "data": message},
                    user_id
                )
                
        except WebSocketDisconnect:
            manager.disconnect(websocket, user_id)
            logger.info(f"User {user_id} disconnected from WebSocket")
            
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        await websocket.close()


async def notify_invoice_status(invoice_id: int, user_id: int, status: str, message: str):
    """Send invoice status update to user.
    
    Args:
        invoice_id: ID of the invoice
        user_id: ID of the user to notify
        status: Invoice status
        message: Status message
    """
    await manager.send_personal_message(
        {
            "type": "invoice_update",
            "invoice_id": invoice_id,
            "status": status,
            "message": message,
        },
        user_id
    )
