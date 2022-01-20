import importData from '../data/php-functions';
import { PhpInfo } from './types';
import Twitter from 'twitter-lite';

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY || '',
  consumer_secret: process.env.CONSUMER_SECRET || '',
  access_token_key: process.env.ACCESS_TOKEN_KEY || '',
  access_token_secret: process.env.ACCESS_TOKEN_SECRET || ''
});

const functionList: PhpInfo[] = importData;

const basePath = 'https://www.php.net/manual/en/';

export function getRandomPhpFunction(): PhpInfo {
  const randomIndex = Math.floor(Math.random() * functionList.length);
  return functionList[randomIndex];
}

function conjugate(description: string) : string {
  const firstWord = description.split(' ')[0];
  if (firstWord.endsWith('s')) {
    return description.replace(firstWord, firstWord.slice(0, -1).toLowerCase());
  }
  return description.replace(firstWord, firstWord.toLowerCase());
}

export function formatMessage(data: PhpInfo): string {
  return `Can PHP ${conjugate(data.description)}? \n\nYes it can! with ${data.name}! \n\n${basePath}${data.href}`;
}

export async function phpcan(req: any, res: any): Promise<string> {
  if (!req.body || req.body !== process.env.PASSWORD) {
    console.error('Invalid password: ', req?.body || 'empty')
    res.sendStatus(403);
    return 'Invalid request';
  }

  const data = getRandomPhpFunction();
  const message = formatMessage(data);

  const response = await client.post('statuses/update', { status: message })
    .then((response) => {
      const msg = `Tweet @ ${Date()} : ${response.text}`;
      console.log(msg)
      res.send(msg);
      return msg;
    }).catch((err) => {
      console.error(err);
      res.send(`Error @ ${Date()} : ${err}`).status(500);
      return `PhpCan error at ${new Date()} : ${err}`;
    });

  return response;
}
