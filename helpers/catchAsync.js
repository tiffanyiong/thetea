module.exports = func => {   //func is what you pass in
    return (req, res, next) => {  //return a func that has func excuted 
        func(req, res, next).catch(next) // that catch error then pass it to next
    }
}