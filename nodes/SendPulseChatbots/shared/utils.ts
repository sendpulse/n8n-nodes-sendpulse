interface Texts {
    messageText: string;
}

export function prepareMessage(channel: string, text: string|Texts[]): object {
    switch (channel) {
        case 'telegram':
            return {
                type: 'text',
                text: text as string,
            };
        case 'messenger':
            return {
                type: 'RESPONSE',
                tag: 'CUSTOMER_FEEDBACK',
                content_type: 'message',
                text: text as string,
            };
        case 'whatsapp':
            return {
                type: 'text',
                text: {
                    body: text as string,
                },
            };
        case 'instagram':
            return (text as Texts[]).map(item => ({
                type: 'text',
                message: {
                    text: item.messageText,
                },
            }));
        case 'live-chat':
        case 'viber/chatbots':
        case 'tiktok':
            return (text as Texts[]).map(item => ({
                type: 'text',
                text: {
                    text: item.messageText,
                }
            }));
        default:
            throw new Error(`Unsupported channel: ${channel}`);
    }
}
