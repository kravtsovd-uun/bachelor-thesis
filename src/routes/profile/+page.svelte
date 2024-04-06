<script>
	import { Avatar, FileButton } from '@skeletonlabs/skeleton';
	import { processUserInitials } from '$lib/serviceFunctions.js';
	import { fade } from 'svelte/transition';
	export let data;

	let userDataChanged = false;
	let avatarFiles = [];
	$: avatarSrc = avatarFiles.length > 0 ? URL.createObjectURL(avatarFiles[0]) : '';
</script>

<main class="flex gap-32 p-4">
	<form action="?/updateProfile" method="POST" enctype="multipart/form-data" id="profileUpdateForm">
		<h1 class="h1 text-4xl font-bold">Profil uživatele</h1>
		<hr />
		<h2 class="h2 mt-4 text-3xl font-bold">{data?.user?.name}</h2>
		<h3 class="h3 mt-12 text-2xl font-medium">Aktualizace profilu</h3>

		<h4 class="h4 mt-2 font-medium">Jméno uživatele</h4>
		<input
			type="text"
			value={data?.user?.name}
			name="name"
			class="w-64 text-black"
			on:input={() => (userDataChanged = true)}
		/>

		<h4 class="h4 mt-2 font-medium">Profilový obrázek</h4>
		<Avatar
			class="mt-2 w-32"
			background="bg-primary-500"
			initials={processUserInitials(data?.user?.name)}
			src={data?.avatarSrc || avatarSrc}
			id="avatar-preview"
		/>
		<FileButton
			name="avatar"
			button="btn variant-filled-primary"
			class="mt-4"
			accept="image/jpeg, image/png, image/webp"
			id="avatar-preview-input"
			bind:files={avatarFiles}
			on:change={() => {
				//restrict to 2MB file size
				if (avatarFiles[0].size > 2097152) {
					alert('Velikost nahrávaného obrázku nesmí přesáhnout 2MB');
					avatarSrc = '';
					avatarFiles = [];
					document.getElementById('avatar-preview-input').value = '';
				} else {
					document.getElementById('avatar-preview').src = avatarSrc;
					userDataChanged = true;
				}
			}}>Procházet</FileButton
		>
		{#if userDataChanged}
			<button
				class="variant-filled-success btn mt-4 w-64"
				type="submit"
				transition:fade={{ duration: 500 }}>Aktualizovat</button
			>
		{/if}
	</form>
	<section>
		<h2 class="h2">Patří ke školám</h2>
		<hr />
		<ul class="bg-primary-400-500-token space-y-4">
			{#if !data?.user?.employee_of.length}
				<li class="px-2"><h5 class="h5">Nepatří k žádné škole</h5></li>
			{:else}
				{#each data?.schoolList as school, i}
					<li>{school.name}</li>
				{/each}
			{/if}
		</ul>
	</section>
</main>
