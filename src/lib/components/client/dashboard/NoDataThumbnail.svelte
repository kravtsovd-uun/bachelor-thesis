<script>
	export let userRole = 'teacher';
	export let isDataLastPage = false;
</script>

<section
	class={`variant-soft-surface text-surface-700-200-token mt-8 grid ${isDataLastPage ? 'h-40' : 'h-80'} place-items-center rounded-lg font-extrabold`}
>
	<div class="text-center">
		{#if isDataLastPage}
			<h3 class="h3">Žádná další nadcházející agenda...</h3>
		{:else}
			<h2 class="h2">Žádná agenda</h2>
		{/if}
		{#if userRole === 'school'}
			<button type="button" class="variant-ghost-success btn mt-2 font-normal">
				Vytvořit studijní skupinu
			</button>
		{:else}
			<h4 class="h4 mt-2 font-normal">
				Obraťte se na odpovědného zástupce své školy nebo si zkuste vyhledat nabídky na burze.
			</h4>
		{/if}
	</div>
</section>
