class APIfeatures{
    constructor(mongoQuery, routeQueryObject){
        this.mongoQuery = mongoQuery
        this.routeQueryObject = routeQueryObject
    }

    filter(){
        const queryObject = { ...this.routeQueryObject}
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObject[el]);

        //1B. Adavanced filtering
        // { duration: { gte: '5' }, price: '397' } => { duration: { $gte: '5' }, price: '397' }

        let queryStr = JSON.stringify(queryObject)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

        this.mongoQuery = this.mongoQuery.find(JSON.parse(queryStr))

        return this //so that we can chain other methods of the class
    }

    sort(){
        //2. Sorting(eg. Asc: sort=price desc: sort=-price)
        //eg http://localhost:8000/api/v1/tours/?sort=price,duration => ...?sort=price duration
        if(this.routeQueryObject.sort){
            const sortBy = this.routeQueryObject.sort.split(',').join(' ')
            this.mongoQuery = this.mongoQuery.sort(sortBy)
        }else{
            //default
            this.mongoQuery = this.mongoQuery.sort('-createdAt')
        }
        return this
    }

    limitFields(){
        //3 Field Limiting
        //api eg: http://localhost:8000/api/v1/tours/?fields=name,summary,price => 'name summary price'
        if(this.routeQueryObject.fields){
            const fields = this.routeQueryObject.fields.split(',').join(' ')
            this.mongoQuery = this.mongoQuery.select(fields)
        }else{
            this.mongoQuery = this.mongoQuery.select('-__v')
        }
        return this
    }

    paginate(){
         //4 Pagination
        const page = parseInt(this.routeQueryObject.page) || 1
        const limit = parseInt(this.routeQueryObject.limit) || 10;
        const skip = (page - 1) * limit
        
        this.mongoQuery = this.mongoQuery.skip(skip).limit(limit)
        return this
    }
}

module.exports = APIfeatures