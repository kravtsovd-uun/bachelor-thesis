<script>
	export let userRole = 'teacher';
</script>

<section
	class="bg-surface-200-700-token text-surface-700-200-token mt-8 grid h-80 place-items-center rounded-lg font-extrabold"
>
	<div class="text-center">
		<h2 class="h2">Žádná agenda</h2>
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
