<script>
  import { onDestroy } from 'svelte'

  let foo = new Date()
  const interval = setInterval(() => foo = new Date(), 1000)
  onDestroy(() => clearInterval(interval))
</script>

<p>The current DateTime is {foo}</p>