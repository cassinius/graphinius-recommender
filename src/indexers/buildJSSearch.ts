import * as JSSearch from 'js-search';
import { IGraph } from 'graphinius/lib/core/Graph';
import { IndexConfig } from './interfaces';

type Types = {[key: string]: any[]};
type Indexes = {[key: string]: any};

const JsSearch = JSSearch.default;


function buildIdxJSSearch(graph: IGraph, idxConfig: IndexConfig) : {} {
  const types: Types = {};
  Object.keys(idxConfig).forEach(k => types[k] = []);
  const indexes: Indexes = {};
  Object.keys(idxConfig).forEach(k => indexes[k] = null);

  Object.values(graph.getNodes()).forEach( n => {
    const label = n.getLabel();
    const idxObj = idxConfig[label];
    if ( !idxObj ) {
      console.log(`Node Type not supported in Meetup scenario...!`);
      return false;
    }
    let idxEntry = {id: n.getID()};
    idxObj.fields.forEach(f => idxEntry[f] = n.getFeature(f));

    // console.log(idxEntry);

    types[label].push(idxEntry);
  });
  Object.keys(types).forEach(k => console.log(`${types[k].length} nodes of type ${k} registered.`));

  Object.values(idxConfig).forEach(model => {
    indexes[model.string] = new JsSearch.Search(model.id);
    model.fields.forEach(f => indexes[model.string].addIndex(f));
    indexes[model.string].addDocuments(types[model.string]);
  });
  
  /* Hackety hack */
  window.idxJSSearch = indexes;
  return indexes;
}


export {
  buildIdxJSSearch
}
