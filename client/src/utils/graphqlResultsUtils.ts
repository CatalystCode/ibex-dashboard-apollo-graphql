// transormation methods from the graphql server response format to the specific format required
// by the UI components
export default {

  // This method is designed to transform the 'lineCharts' element from the graphql server into the 'LineChart' UI 
  // component.
  // the server returns the following format:
  // "lineCharts": [
  // {
  //   "seriesData": [
  //     {
  //       "label": "webchat",
  //       "x_values": [
  //         "2017-04-12T15:05:00Z",
  //         ...
  //         "2017-07-10T09:10:00Z"
  //       ],
  //       "y_values": [
  //         3,
  //         ..
  //         1
  //       ]
  //     }
  //    ]
  // }
  // the UI expect the following:
  // [ { name: 'Page A', uv: 101, pv: 2090, amt: 1200 },
  // { name: 'Page B', uv: 1030, pv: 2058, amt: 2210 },
  // { name: 'Page C', uv: 1005, pv: 2700, amt: 3290 },
  // { name: 'Page D', uv: 1006, pv: 2008, amt: 5200 },
  // { name: 'Page E', uv: 1600, pv: 2050, amt: 3281 },
  // { name: 'Page F', uv: 1080, pv: 2020, amt: 9200 },
  // { name: 'Page G', uv: 1060, pv: 2100, amt: 1200 } ]
  lineChartsDataTransform: (data, shouldSortByDate) => {
    if (!data) {
      return [];
    }

    let dictionary = [];

    data = data[0].seriesData;
    let knownSeriesNames = [];
    // at the end of this loop statement you end up with a dictionary of xValues and their matching points:
    // e.g. [13/7/2017] = [ {"skype", 3}, {"webchat", 4}]
    // for each series
    for (let i = 0; i < data.length; i++) {
      // each point
      for (let j = 0; j < data[i].x_values.length; j++) {
        if (!dictionary[data[i].x_values[j]]) {
          dictionary[data[i].x_values[j]] = [];
        }
        dictionary[data[i].x_values[j]].push({ label: data[i].label, value: data[i].y_values[j] });
        if (!knownSeriesNames[data[i].label]) {
          knownSeriesNames[data[i].label] = 1;
        }
      }
    }

    // at the end of this loop statement you end up with a dictionary of xValues and their matching points same as
    // above, only that missing labels will now have 0 value added
    // e.g. [13/7/2017] = [ { "skype", 3 }, { "webchat", 4 }, { "missingChannel", 0 } ]
    let expectedLength = Object.keys(knownSeriesNames).length;
    for (let key in dictionary) {
      if (dictionary.hasOwnProperty(key)) {
        let items = dictionary[key];
        if (items.length !== expectedLength) {
          for (let i = 0; i < expectedLength; i++) {
            let missingLabel = Object.keys(knownSeriesNames)[i];
            if (!dictionary[key].find((x) => x.label === missingLabel)) {
              dictionary[key].push({ label: missingLabel, value: 0 });
            }
          }
        }
      }
    }

    let formatted = [];
    for (let key in dictionary) {
      if (dictionary.hasOwnProperty(key)) {
        let items = dictionary[key];
        let item = { name: key };
        for (let k = 0; k < items.length; k++) {
          item[items[k].label] = items[k].value;
        }

        formatted.push(item);
      }
    }

    // only if the first column is a date column
    if (shouldSortByDate) {
      return formatted.sort(function (a: any, b: any) {
        return Date.parse(a.name) - Date.parse(b.name);
      });
    }

    return formatted;
  },

  // the UI expect the following:
  // [{ name: 'Group A', value: 400 }, { name: 'Group B', value: 300 },
  //  { name: 'Group C', value: 300 }, { name: 'Group D', value: 200 },
  //  { name: 'Group E', value: 278 }, { name: 'Group F', value: 189 }]
  pieChartsDataTransform: (data) => {
    if (!data) {
      return [];
    }

    var res = [];

    data = data[0];
    for (var i = 0; i < data.labels.length; i++) {
      res.push({ name: data.labels[i], value: data.values[i] });
    }
    return res;
  },

  DropDownComponentDataTransform: (channels: any) => {
    var res = [];
    if (!channels) {
      return res;
    }

    for (var i = 0; i < channels.length; i++) {
      res.push({ id: channels[i].id, name: channels[i].name });
    }
    return res;
  }
};