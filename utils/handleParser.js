const db = require('../models/index');

async function ParseHandle (title) {
    let lowerTitle = title.toLowerCase();
    let newTitle = lowerTitle.replace(/[ ]/g,'-');
    const ExistingHandle = await db.handles.find({
        where:{
            handle: {
                [Op.substring]: newTitle
              },
              order: [ [ 'createdAt', 'DESC' ]]
        }
    })
    if(ExistingHandle) {
        return ExistingHandle[ExistingHandle.length-1];
    }
    else {
        return newTitle;
    }
}

module.exports = { ParseHandle };