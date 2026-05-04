import { createClient } from './client';

const supabase = createClient();

export function createSessionChannel(token: string) {
  return supabase.channel(`session_${token}`, {
    config: {
      broadcast: { self: true },
    },
  });
}

export function broadcastMessage(channel: any, payload: { sender: string; text: string; timestamp: string }) {
  channel.send({
    type: 'broadcast',
    event: 'message',
    payload,
  });
}

export function subscribeToMessages(channel: any, onMessage: (payload: any) => void) {
  channel.on('broadcast', { event: 'message' }, ({ payload }: any) => {
    onMessage(payload);
  }).subscribe();
}
