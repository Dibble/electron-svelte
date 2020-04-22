<script>
  const suits = ['hearts', 'diamonds', 'spades', 'clubs']
  const values = ['ace', 'king', 'queen', 'jack', 'ten', 'nine', 'eight', 'seven', 'six', 'five', 'four', 'three', 'two']
  const deck = suits.map(suit => values.map(value => ({ face: 'down', suit, value}))).flat()

  let foundation = [[], [], [], []]
  let stock = [...deck]
  let waste = []
  let tableau = [[], [], [], [], [], [], []]

  const initialDeal = () => {
    for (let i = 0; i < tableau.length; i++) {
      let tableauColumn = i

      while (tableauColumn < tableau.length) {
        const card = stock.pop()
        stock = stock
  
        tableau[tableauColumn] = [...tableau[tableauColumn], { ...card, face: tableauColumn === i ? 'up' : 'down' }]
        tableauColumn++
      }
    }
  }
</script>

<p>Foundation: {foundation.map(f => f.length > 0 ? f[f.length - 1] : 'empty')}</p>
<p>Waste: {waste.length > 0 ? waste[waste.length - 1] : 'empty'}</p>
<p>Stock: {stock.length}</p>

<h3>Tableau:</h3>
{#each tableau as t}
  <p>{t.length > 0 ? t.map(card => card.face === 'up' ? `${card.value} of ${card.suit}` : 'hidden').join(', ') : 'empty'}</p>
{/each}

<button on:click={initialDeal}>Initial Deal</button>