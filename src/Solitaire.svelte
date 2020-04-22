<script>
  const suits = ['hearts', 'diamonds', 'spades', 'clubs']
  const values = ['ace', 'king', 'queen', 'jack', 'ten', 'nine', 'eight', 'seven', 'six', 'five', 'four', 'three', 'two']
  const deck = suits.map(suit => values.map(value => ({ face: 'down', suit, value}))).flat()

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
  
  const shuffleCards = (inputCards) => {
    const cards = [...inputCards]
    const outputCards = []
    
    while(cards.length > 0) {
      const indexToMove = Math.floor(Math.random() * cards.length)
      
      const [selectedCard] = cards.splice(indexToMove, 1)
      outputCards.push(selectedCard)
    }
    console.log(outputCards)
    return outputCards
  }

  let foundation = [[], [], [], []]
  let stock = shuffleCards(deck)
  let waste = []
  let tableau = [[], [], [], [], [], [], []]
</script>

<p>Foundation: {foundation.map(f => f.length > 0 ? f[f.length - 1] : 'empty')}</p>
<p>Waste: {waste.length > 0 ? waste[waste.length - 1] : 'empty'}</p>
<p>Stock: {stock.length}</p>

<h3>Tableau:</h3>
{#each tableau as t}
  <p>{t.length > 0 ? t.map(card => card.face === 'up' ? `${card.value} of ${card.suit}` : 'hidden').join(', ') : 'empty'}</p>
{/each}

<button on:click={initialDeal}>Initial Deal</button>