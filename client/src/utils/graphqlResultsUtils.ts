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
  lineChartsDataTransform: (data) => {
    if (!data) {
      return [];
    }

    var dictionary = [];

    data = data[0].seriesData;
    var formatted = [];
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].x_values.length; j++) {
        if (!dictionary[data[i].x_values[j]]) {
          dictionary[data[i].x_values[j]] = [];
        }
        dictionary[data[i].x_values[j]].push({ label: data[i].label, value: data[i].y_values[j] });
      }
    }

    for (var key in dictionary) {
      if (dictionary.hasOwnProperty(key)) {
        var items = dictionary[key];
        var item = { name: key };
        for (var k = 0; k < items.length; k++) {
          item[items[k].label] = items[k].value;
        }

        formatted.push(item);
      }
    }

    return formatted.sort(function (a: any, b: any) {
      return Date.parse(a.name) - Date.parse(b.name);
    });
  },

  pieChartsDataTransform: () => {
    return [{ name: 'Group A', value: 400 }, { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 }, { name: 'Group D', value: 200 },
    { name: 'Group E', value: 278 }, { name: 'Group F', value: 189 }];
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