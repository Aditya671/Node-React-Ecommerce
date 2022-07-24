import crypto from 'crypto';

export const generateSecketCipher = () => {
   const initVector = crypto.randomBytes(16);
   const Securitykey = crypto.randomBytes(32);
   const algo = 'aes-256-cbc';

   const cipherText = crypto.createCipheriv( algo, Securitykey,initVector  );
   const secret = cipherText.update('qWHpK3kRIu0nzE1WBx8cFMlopvmdtT3u', 'utf8', 'hex')
   const secretJWTKey = secret + cipherText.final('hex');
   return secretJWTKey;
}
// 'qWHpK3kRIu0nzE1WBx8cFMlopvmdtT3u'
// process.env.SECRET_CIPHER