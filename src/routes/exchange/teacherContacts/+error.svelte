<script>
	import { page } from '$app/stores';
</script>

<section class="grid place-items-center p-8">
	<div class="card variant-ghost-error p-4">
		{#if $page.error.message}
			<h3 class="text-error-700-200-token h3">{$page.error.message}</h3>
		{:else}
			<h3 class="text-error-700-200-token h3">Neočekaváná chyba: Opravdu nevíme, co se stalo.</h3>
		{/if}
		<div class="mt-4 flex justify-center">
			<a href="/" class="variant-ghost-surface btn font-bold">Agenda</a>
		</div>
	</div>
</section>
