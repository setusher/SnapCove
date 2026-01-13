from channels.generic.websocket import AsyncJsonWebsocketConsumer

#websocket for send/receive notifs
#timer hatane ke liye
class NotificationConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        #user not logged in-> connection close kar do
        if self.scope["user"].is_anonymous:
            await self.close()
            return
        #group create-> channel join -> connection accept
        self.group = f"user_{self.scope['user'].id}"
        await self.channel_layer.group_add(self.group, self.channel_name)
        await self.accept()
    
    async def disconnect(self, close_code):
        #channel leave
        await self.channel_layer.group_discard(self.group, self.channel_name)
    #send type ->notif->call below function
    async def notify(self, event):
        await self.send_json(event["data"])
