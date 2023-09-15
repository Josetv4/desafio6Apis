
async function getAndCreateDataToChart(destinationCurrency) {
  //Variables para Obtener información de la Api
  const apiUrlDolar = "https://mindicador.cl/api/dolar";
  const apiUrlEuro = "https://mindicador.cl/api/euro";
  const apiUrlBitcoin = "https://mindicador.cl/api/bitcoin";

  //Condición para que al momento de seleccionar una opcion del select se  muestre el grafico correspondiente a la moneda seleccionada
  let url;
    if (destinationCurrency === "dolar") {
        url = apiUrlDolar;
    } else if (destinationCurrency === "euro") {
        url = apiUrlEuro;
    } else if (destinationCurrency === "bitcoin") {
        url = apiUrlBitcoin;
    }
// Variables para obtener los valores de la Api dependiendo de la moneda
  const res = await fetch(url);
  const data = await res.json();
  const serie = data.serie.slice(0, 10); // Limitamos a los últimos 10 datos
// con este metodo map, obtengo valor por valor de los objetos dentro del array serie, declarado en la api 
  const labels = serie.map((item) => {
      return item.fecha;
  });
  const valores = serie.map((item) => {
      return item.valor;
  });

  return { labels, valores };
}

async function renderGrafica() {
  const destinationCurrency = document.getElementById("destinationCurrency").value; //variable del DOM, corresponde al select
  const data = await getAndCreateDataToChart(destinationCurrency); 
  const config = {
      type: "line",
      data: {
          labels: data.labels,
          datasets: [
              {
                  label: `Precio de ${destinationCurrency}`,
                  borderColor: "green",
                  data: data.valores
              }
          ]
      }
  };
  const graphCanvas = document.getElementById("graph"); // variable del DOM, corresponde a la etiqueta canva
  graphCanvas.style.backgroundColor = "#dff5fa";
  graphCanvas.style.borderRadius = "3%";

  // Eliminamos el gráfico anterior antes de crear uno nuevo
  if (window.myChart) {
      window.myChart.destroy();
  }

  window.myChart = new Chart(graphCanvas, config);
}

async function convertir() {
  const valorInput = document.getElementById("pesos"); // Variable del DOM, input tipo numerica
  const amount = valorInput.value; //se obtiene el valor del input
  const destinationCurrency = document.getElementById("destinationCurrency").value; //variable del DOM, corresponde al select, la declaro nuevamente ya que no es una variable global
  try {
      const url = "https://mindicador.cl/api";

      const response = await fetch(url);
      const data = await response.json();

      const resultado = amount / data[destinationCurrency].valor;

      mostrarResultado(resultado, destinationCurrency);
      renderGrafica();
  } catch (error) {
      console.error(error);
  }
}

function mostrarResultado(resultado, destinationCurrency) {
  const result = document.getElementById("result");

  if (destinationCurrency === "dolar") {
    result.innerHTML = `El resultado es: $${resultado.toFixed(2)} Dólares`;
  } else if (destinationCurrency === "euro") {
    result.innerHTML = `El resultado es: €${resultado.toFixed(2)} Euros`;
  } else if (destinationCurrency === "bitcoin") {
    result.innerHTML = `El resultado es: ${resultado.toFixed(6)} Bitcoins`;
  }
}

document.getElementById("btnGetValor").addEventListener("click", function() {
  convertir();
});

// Llama a la función para renderizar el gráfico al cargar la página
renderGrafica();