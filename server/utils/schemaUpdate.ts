
import * as fs from 'fs';

const getSchemaPath = (model: string): string => {  
  return `./src/api/${model}/content-types/${model}/schema.json`
}

const getSchema = (model: string) => {
  return JSON.parse(fs.readFileSync(getSchemaPath(model)).toString())
} 

const updateSchema = (model: string, data: Object) => {
  fs.writeFileSync(getSchemaPath(model), JSON.stringify(data))
}

export default () => ({
  addAttribute(model: string, field: string, config: {[key: string]: any}) {
    let schema = getSchema(model)
    schema.attributes[field] = config
    updateSchema(model, schema)
  },
  removeAttribute(model: string, attribute_key: string) {
    let schema = getSchema(model)
    delete schema.attributes[attribute_key]
    updateSchema(model, schema)
  }
})