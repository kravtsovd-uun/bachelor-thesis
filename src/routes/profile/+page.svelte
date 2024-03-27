<script>
	import { Avatar, FileButton } from '@skeletonlabs/skeleton';
	import { processUserInitials } from '$lib/serviceFunctions.js';
	export let data;

	let avatarFiles = [];
	$: avatarSrc = avatarFiles.length > 0 ? URL.createObjectURL(avatarFiles[0]) : '';
</script>

<main class="p-4">
	<form action="?/updateProfile" method="POST" enctype="multipart/form-data" id="profileUpdateForm">
		<h1 class="h1 text-4xl font-bold">Profil uživatele</h1>
		<hr />
		<h2 class="h2 mt-4 text-3xl font-bold">{data?.user?.name}</h2>
		<h3 class="h3 mt-12 text-2xl font-medium">Aktualizace profilu</h3>
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
			accept="image/*"
			bind:files={avatarFiles}
			on:change={() => {
				document.getElementById('avatar-preview').src = avatarSrc;
			}}>Nahrát</FileButton
		>
		<input type="text" value={data?.user?.name} name="name" class="text-black" />
		<button class="variant-ghost-error btn mt-4 w-32"> Smazat </button>
		<button class="variant-filled-success btn mt-4 w-32" type="submit">Aktualizovat</button>
	</form>
</main>
