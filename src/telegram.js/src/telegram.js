import crypto from 'node:crypto';

export function validateTelegramInitData(initData, botToken) {
  if (!initData || !botToken) {
    throw new Error('Нет данных Telegram');
  }

  const params = new URLSearchParams(initData);
  const hash = params.get('hash');

  if (!hash) {
    throw new Error('Отсутствует hash');
  }

  params.delete('hash');

  const dataCheckString = [...params.entries()]
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join('\n');

  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();

  const computedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  if (computedHash !== hash) {
    throw new Error('Недействительная подпись Telegram');
  }

  const user = JSON.parse(params.get('user') || '{}');

  if (!user.id) {
    throw new Error('Не найден Telegram ID');
  }

  return {
    id: user.id,
    username: user.username || '',
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    photo_url: user.photo_url || ''
  };
}
