const fs = require('fs');
const path = require('path');

const getDataFromFile = (fileName, query, filterKey, filterValues) => {
  return new Promise((resolve, reject) => {
    var fileContent = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../', 'sampleData', fileName), 'utf8'));
    
    // if filters required, lets filter by the channels. this is a hack just for the purpose of the sample data
    // and it looks for the label in seriesData, so other datasources will not be filtered..
    if (filterValues && filterValues.length > 0) {
      if (fileContent[query][0].seriesData) {
        var newValues = JSON.parse(JSON.stringify(fileContent[query][0].seriesData));
        for (let i = fileContent[query][0].seriesData.length - 1; i >= 0; i--) {
          if (filterValues.indexOf(fileContent[query][0].seriesData[i].label) === -1) {
            newValues.splice(i, 1);
          } 
        }
        resolve([ {seriesData: newValues }]);
      }
    }

    resolve(fileContent[query]);
  });
};

module.exports = {
  getDataFromFile,
};
