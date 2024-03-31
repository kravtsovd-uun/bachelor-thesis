<script>
	import { getModalStore } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();

	function onFormSubmit() {
		alert('Form submit simulated');
		modalStore.close();
	}
</script>

{#if $modalStore[0]}
	<div class="card w-modal space-y-4 p-4 shadow-xl">
		<header class="text-2xl font-bold">{$modalStore[0].title ?? '(Žádný název)'}</header>
		<article>{$modalStore[0].body ?? '(Žádné tělo formuláře)'}</article>
		<form method="POST" class="space-y-4 border border-surface-500 p-4">
			<label class="label">
				<span>Jméno</span>
				<input class="input" type="text" name="name" placeholder="Vložte jméno" />
			</label>

			<label class="label">
				<span>E-mail</span>
				<input
					class="input"
					type="email"
					autocomplete="email"
					name="name"
					placeholder="info@jaska.cz"
				/>
			</label>
		</form>
		<footer class="flex w-full justify-end gap-2">
			<button class="variant-ghost-error btn font-thin" on:click={() => modalStore.close()}
				>Storno</button
			>
			<button class="variant-filled-success btn basis-1/3 font-bold" on:click={onFormSubmit}
				>Vytvořit</button
			>
		</footer>
	</div>
{/if}
