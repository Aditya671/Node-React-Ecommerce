import crypto from 'crypto';

export const generateSecketCipher = (token) => {
   const initVector = crypto.randomBytes(16);
   const Securitykey = crypto.randomBytes(32);
   const algo = 'aes256';

   const cipherText = crypto.createCipheriv( algo, Securitykey,initVector  );
   const secret = cipherText.update(token, 'utf8', 'hex')
   const secretJWTKey = secret + cipherText.final('hex');
   return secretJWTKey;
}
// 'qWHpK3kRIu0nzE1WBx8cFMlopvmdtT3u'
// process.env.SECRET_CIPHER