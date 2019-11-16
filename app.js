(async function () {

  const dataSort = (arr) => {
    return arr.sort((a, b) => {
      if (+a.x > +b.x) {
        return 1;
      }
      if (+a.x < +b.x) {
        return -1;
      }

      return +a.y - +b.y;
    });
  };

  function normalizeCoords(dataObj) {
    let arrayCoords = dataObj.map(str => {
      const arr = str.split(';');
      return {
        x: +arr[0],
        y: +arr[1]
      }
    });

    return dataSort(arrayCoords)
  }




  let staticCtx, dynamicCtx;

  function lineRender(data, ctx) {
    ctx.font = 'normal 16px serif';
    ctx.moveTo(data[0].x,data[0].y);
    ctx.fillText( 'x: ' + data[0].x + ' y: ' + data[0].y, data[0].x -30, data[0].y);
    data.forEach((item, i) => {
      if(i) {
        ctx.lineTo(item.x,item.y);
        ctx.fillText( 'x: ' + item.x + ' y: ' + item.y, item.x -30, item.y);
      }
    });
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function validate(array) {
    return array.filter(item => item.x && !isNaN(item.x) && item.y && !isNaN(item.y))
  }

  let response = await fetch('input.json');

  if (response.ok) { // если HTTP-статус в диапазоне 200-299
                     // получаем тело ответа (см. про этот метод ниже)


    let json = await response.json();
    console.log(json);

    new Vue({
      el: '#app',
      data: {
        testCoords: normalizeCoords(Object.values(json)),
        userCoordsListEnter: [{x: '', y: ''}],
        userCoordsListOutput: null,
        isShowEnterData: false,
      },
      methods: {
        showForm() {
          this.isShowEnterData = !this.isShowEnterData
        },
        addItemForm() {
          this.userCoordsListEnter.push({x: '', y: ''})
        },
        processingForm() {
          const processedData = dataSort(validate(this.userCoordsListEnter.map(item => {
            return {...item}
          })));
          lineRender(processedData, dynamicCtx);
          this.userCoordsListOutput = processedData
        },
        join(array) {
          return array.map(item => item.x + ';' + item.y)
        },
      },

      mounted: function () {
        dynamicCtx = document.getElementById('dynamic').getContext('2d');
        staticCtx = document.getElementById('static').getContext('2d');

        dynamicCtx.strokeStyle = '#b80d14';
        staticCtx.strokeStyle = '#0036b8';
        lineRender(this.testCoords, staticCtx);
      }
    });

  } else {
    alert("Ошибка HTTP: " + response.status);
  }


})();




