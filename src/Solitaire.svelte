<script>
  const suits = ['hearts', 'diamonds', 'spades', 'clubs']
  const values = ['king', 'queen', 'jack', 'ten', 'nine', 'eight', 'seven', 'six', 'five', 'four', 'three', 'two', 'ace']
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

  const dealFromStock = () => { // assume one card at a time, unlimited cycles
    if (stock.length === 0) {
      stock = [...waste].map(card => ({...card, face: 'down'})).reverse()
      waste = []
      return
    }

    const card = stock.pop()
    stock = stock

    waste = [...waste, {...card, face: 'up'}]
  }

  const moveWasteToTableau = () => {
    const card = waste[waste.length - 1]
    console.log('move waste to tab', card)
    for (let i = 0; i < tableau.length; i++) {
      let tableauCard = tableau[i][tableau[i].length - 1]
      if (card.value === 'king' && tableau[i].length === 0 || // king can move to empty column
        (values.indexOf(card.value) - values.indexOf(tableauCard.value) === 1) && // card value is suitable
        (suits.indexOf(card.suit) < 2 && suits.indexOf(tableauCard.suit) > 1 || // red card on black tableau
        suits.indexOf(card.suit) > 1 && suits.indexOf(tableauCard.suit) < 2)) { // black card on red tableau
          console.log('card can be placed', i)
          tableau[i] = [...tableau[i], {...card, face: 'up'}]
          waste.pop()
          waste = waste
          break
      }
    }
  }

  const moveFromTableauToFoundation = (column, row) => {
    console.log('move from tableau to foundation', column, row)
    if (tableau[column][row].face === 'down') { // can't move face down cards to foundation
      console.log('card face down')
      return
    }

    if (row >= tableau[column].length) { // not bottom card in the stack
      console.log('not bottom card')
      return
    }

    const card = tableau[column][row]
    console.log('card', card)

    let eligibleFoundationIndex = null
    for (let i = 0; i < foundation.length; i++) {
      const foundationColumn = foundation[i]
      if (foundationColumn.length === 0) {
        eligibleFoundationIndex = card.value === 'ace' ? i : null
        break
      }

      if (foundationColumn[0].suit !== card.suit) continue

      if (values.indexOf(foundationColumn[foundationColumn.length - 1].value) - values.indexOf(card.value) === 1) {
        eligibleFoundationIndex = i
        break
      }
    }
    
    console.log('eligible foundation index', eligibleFoundationIndex)
    if (eligibleFoundationIndex !== null) {
      console.log('moving card')
      tableau[column].pop()
      tableau[column][row - 1].face = 'up'
      tableau = tableau

      foundation[eligibleFoundationIndex] = [...foundation[eligibleFoundationIndex], card]
    }
  }

  let foundation = [[], [], [], []]
  let stock = shuffleCards(deck)
  let waste = []
  let tableau = [[], [], [], [], [], [], []]
</script>

<p>Foundation: {foundation.map(f => f.length > 0 ? `${f[f.length - 1].value} of ${f[f.length - 1].suit}` : 'empty')}</p>
<p>Waste: {waste.length > 0 ? `${waste[waste.length - 1].value} of ${waste[waste.length - 1].suit}` : 'empty'}</p>
<button on:click={moveWasteToTableau}>{waste.length > 0 ? 'Play card from waste' : 'Waste empty'}</button>
<p>Stock: {stock.length}</p>
<button on:click={dealFromStock}>{stock.length > 0 ? 'Deal from Stock' : 'Recycle'}</button>

<h3>Tableau:</h3>
{#each tableau as t, col}
  <p>{t.length > 0 ? t.map(card => card.face === 'up' ? `${card.value} of ${card.suit}` : 'hidden').join(', ') : 'empty'}</p>
  <button on:click={() => moveFromTableauToFoundation(col, t.length - 1)}>Move to Foundation</button>
{/each}

<button on:click={initialDeal}>Initial Deal</button>