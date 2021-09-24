const moment = require('moment')
const { options } = require('../routes')

module.exports = {
    formatDate: function (date, format) {
        return moment(date).format(format)
    },
    truncate: function (str,len) {
        if (str.length > len && str.length >0){
            let new_str = str + ''
            new_str = str.substr(0,len)
            new_str = str.substr(0, new_str.lastIndexOf(''))
            new_str = new_str.length>0 ? new_str: str.substr(0, len)
            return new_str + '...'
        }
        return str
    },
    stripTags: function (input) {
        return input.replace(/<(?:.|\n)*?>/gm, '')
    },
    editIcon: function(poemUser,loggedUser,poemId,floating=true){
        if(poemUser._id.toString()==loggedUser._id.toString()){
            if(floating){
                return `<a href="/stories/edit/${poemId}" class="btn-floating 
                halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
            }else{
                return `<a href="/stories/edit/${poemId}><i class="fas fa-edit"></i></a>`
            }
        }else{
            return ''
        }
    },
    select:function(selected, option){
        return option
        .fn(this)
        .replace(
            new RegExp('value="'+ selected+'"'),
            '$& selected="selected"'
        )
        .replace(
            new RegExp('>'+selected+'</option>'),
            'selected="selected"$&'
        )
    },
}
