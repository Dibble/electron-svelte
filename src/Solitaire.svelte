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

  const moveFromWaste = () => {
    if (waste.length === 0) return

    const card = waste[waste.length - 1]
    console.log('move from waste', card)

    // try move to foundation
    const eligibleFoundationIndex = canMoveToFoundation(card)
    if (eligibleFoundationIndex > -1) {
      console.log('card can be placed in foundation', eligibleFoundationIndex)
      foundation[eligibleFoundationIndex] = [...foundation[eligibleFoundationIndex], {...card, face: 'up'}]
      waste.pop()
      waste = waste
      return
    }
    
    // try move to tableau
    const eligibleTableauColumn = canMoveToTableau(card)
    if (eligibleTableauColumn > -1) {
      console.log('card can be placed in tableau', eligibleTableauColumn)
      tableau[eligibleTableauColumn] = [...tableau[eligibleTableauColumn], {...card, face: 'up'}]
      waste.pop()
      waste = waste
    }
  }

  const moveFromTableau = (column, row) => {
    console.log('move from tableau', column, row)
    if (tableau[column][row].face === 'down') { // can't move face down cards to foundation
      console.log('card face down')
      return
    }

    const card = tableau[column][row]
    console.log('card', card)

    if (row === tableau[column].length - 1) { // if last card in the column, try move to foundation
      const eligibleFoundationIndex = canMoveToFoundation(card)
      console.log('eligible foundation index', eligibleFoundationIndex)
      if (eligibleFoundationIndex > -1) {
        tableau[column].pop()
        if (row > 0) tableau[column][row - 1].face = 'up'
        tableau = tableau
        
        foundation[eligibleFoundationIndex] = [...foundation[eligibleFoundationIndex], card]
        return
      }
    }
    
    const eligibleTableauColumn = canMoveToTableau(card)
    console.log('eligible tableau column', eligibleTableauColumn)
    if (eligibleTableauColumn > -1) {
      tableau[eligibleTableauColumn] = [...tableau[eligibleTableauColumn], ...tableau[column].splice(row, tableau[column].length - row)]
      if (row > 0) tableau[column][row - 1].face = 'up'
      tableau = tableau
    }
  }

  const moveFromFoundation = (column) => {
    console.log('move from foundation')
    if (foundation[column].length === 0) return

    const card = foundation[column][foundation[column].length - 1]
    console.log('card', card)
    const eligibleTableauColumn = canMoveToTableau(card)
    console.log('eligible tableau column', eligibleTableauColumn)
    if (eligibleTableauColumn > -1) {
      tableau[eligibleTableauColumn] = [...tableau[eligibleTableauColumn], card]
      foundation[column].pop()
      foundation = foundation
    }
  }

  const canMoveToFoundation = (card) => {
    if (card.face === 'down') return -1

    for (let i = 0; i < foundation.length; i++) {
      const foundationColumn = foundation[i]
      if (foundationColumn.length === 0) {
        return card.value === 'ace' ? i : -1
      }

      if (foundationColumn[0].suit !== card.suit) continue

      if (values.indexOf(foundationColumn[foundationColumn.length - 1].value) - values.indexOf(card.value) === 1) {
        return i
      }
    }

    return -1
  }

  const canMoveToTableau = (card) => {
    for (let i = 0; i < tableau.length; i++) {
      if (tableau[i].length === 0) {
        if (card.value === 'king') return i // king can move to empty column
        continue
      }

      let tableauCard = tableau[i][tableau[i].length - 1]
      if ((values.indexOf(card.value) - values.indexOf(tableauCard.value) === 1) && // card value is suitable
        (suits.indexOf(card.suit) < 2 && suits.indexOf(tableauCard.suit) > 1 || // red card on black tableau
        suits.indexOf(card.suit) > 1 && suits.indexOf(tableauCard.suit) < 2)) { // black card on red tableau
        return i
      }
    }

    return -1
  }

  let foundation = [[], [], [], []]
  let stock = shuffleCards(deck)
  let waste = []
  let tableau = [[], [], [], [], [], [], []]

  initialDeal()
</script>

<h3>Foundation:</h3>
{#each foundation as f, col}
  <p on:click={() => moveFromFoundation(col)}>{f.length > 0 ? `${f[f.length - 1].value} of ${f[f.length - 1].suit}` : 'empty'}</p>
{/each}
<p>Waste: {waste.length > 0 ? `${waste[waste.length - 1].value} of ${waste[waste.length - 1].suit}` : 'empty'}</p>
<button on:click={moveFromWaste}>{waste.length > 0 ? 'Play card from waste' : 'Waste empty'}</button>
<p>Stock: {stock.length}</p>
<button on:click={dealFromStock}>{stock.length > 0 ? 'Deal from Stock' : 'Recycle'}</button>

<h3>Tableau:</h3>
{#each tableau as column, col}
  <ul>
    {#if column.length === 0}
      <li>empty</li>
    {:else}
      {#each column as card, row}
        <li on:click={() => moveFromTableau(col, row)}>{card.face === 'up' ? `${card.value} of ${card.suit}` : 'hidden'}</li>
      {/each}
    {/if}
  </ul>
{/each}