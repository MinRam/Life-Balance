const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (query, context) => {
  const _ = db.command

  if (!query) {
    const result = await db.collection('glossaries').get()
    return result.data
  }
  else {
    const result = await db.collection('glossaries').where(_.or([
      {
        synonyms: {
          $regex: '.*' + query,
          $options: 'i'
        }
      },
      {
        fullname: {
          $regex: '.*' + query,
          $options: 'i'
        }
      }
    ])).field({
      _id: true,
      synonyms: true,
      fullname: true,
      description: true
    }).get()
    return result.data
  }
}