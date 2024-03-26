<script>
	export let data;
</script>

<h1 class="h1">Hello {data?.user?.name || 'user'}!</h1>
{#if data?.user}
	<form method="POST" action="/logout">
		<button type="submit" class="variant-outline-primary btn hover:variant-filled-primary"
			>Logout</button
		>
	</form>
{:else}
	<a href="/login" class="variant-filled-primary btn">Login</a>
{/if}
