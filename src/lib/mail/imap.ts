import imaps from 'imap-simple';
import { simpleParser } from 'mailparser';

export interface ImapConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  tls: boolean;
}

export async function fetchRecentEmails(config: ImapConfig, limit: number = 10) {
  const imapConfig = {
    imap: {
      user: config.user,
      password: config.password,
      host: config.host,
      port: config.port,
      tls: config.tls,
      authTimeout: 30000,
    },
  };

  try {
    const connection = await imaps.connect(imapConfig);
    await connection.openBox('INBOX');

    const searchCriteria = ['ALL'];
    const fetchOptions = {
      bodies: ['HEADER', 'TEXT', ''],
      markSeen: false,
    };

    const messages = await connection.search(searchCriteria, fetchOptions);
    
    // Sort by date descending and take the limit
    const sortedMessages = messages.sort((a, b) => {
      const dateA = new Date(a.attributes.date).getTime();
      const dateB = new Date(b.attributes.date).getTime();
      return dateB - dateA;
    }).slice(0, limit);

    const parsedEmails = await Promise.all(
      sortedMessages.map(async (item) => {
        const all = item.parts.find((part) => part.which === '');
        const id = item.attributes.uid;
        const idHeader = "Imap-UID: " + id + "\r\n";
        const parsed = await simpleParser(idHeader + all?.body);
        
        return {
          uid: id,
          from: parsed.from?.text,
          to: parsed.to?.text,
          subject: parsed.subject,
          date: parsed.date,
          text: parsed.text,
          html: parsed.html,
          messageId: parsed.messageId,
        };
      })
    );

    connection.end();
    return parsedEmails;
  } catch (error) {
    console.error('IMAP Error:', error);
    throw error;
  }
}
