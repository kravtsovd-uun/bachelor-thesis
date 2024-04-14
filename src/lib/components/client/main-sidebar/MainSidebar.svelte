<script>
	export let userRole = 'teacher';
</script>

<aside>
	<div class="variant-filled btn-group-vertical">
		<a href="/" role="button" class="variant-filled btn" data-sveltekit-preload-data="hover"
			>Agenda</a
		>
		<a href="/profile" role="button" class="variant-filled btn" data-sveltekit-preload-data="hover"
			>Profil</a
		>
		{#if userRole === 'school'}
			<a
				href="/employees"
				role="button"
				class="variant-filled btn"
				data-sveltekit-preload-data="hover">Zaměstnanci</a
			>
			<a href="/groups" role="button" class="variant-filled btn" data-sveltekit-preload-data="hover"
				>Skupiny</a
			>
		{/if}
		<a href="/exchange" role="button" class="variant-filled btn" data-sveltekit-preload-data="hover"
			>Burza</a
		>
		<form method="POST" action="/logout">
			<button type="submit" class="variant-outline-primary btn hover:variant-filled-primary"
				>Odhlásit se</button
			>
		</form>
	</div>
</aside>
