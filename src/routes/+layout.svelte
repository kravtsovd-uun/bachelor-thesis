<script>
	import '../app.postcss';
	import { AppShell, AppBar, Avatar, LightSwitch } from '@skeletonlabs/skeleton';

	//Dynamic progress bar above the page during page load
	import 'nprogress/nprogress.css';
	import NProgress from 'nprogress';
	import { navigating } from '$app/stores';

	NProgress.configure({ minimum: 0.16, showSpinner: false });
	$: {
		if ($navigating) {
			NProgress.start();
		} else {
			NProgress.done();
		}
	}

	//Initialize dynamic components stores, like modals, toasts, drawers etc.
	import { Modal as FormModal } from '@skeletonlabs/skeleton';
	import { initializeStores } from '@skeletonlabs/skeleton';
	initializeStores();

	// Highlight JS
	import hljs from 'highlight.js/lib/core';
	import 'highlight.js/styles/github-dark.css';
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import xml from 'highlight.js/lib/languages/xml'; // for HTML
	import css from 'highlight.js/lib/languages/css';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';

	hljs.registerLanguage('xml', xml); // for HTML
	hljs.registerLanguage('css', css);
	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('typescript', typescript);
	storeHighlightJs.set(hljs);

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	import MainSidebar from '$lib/components/client/main-sidebar/MainSidebar.svelte';
	import { processUserInitials } from '$lib/serviceFunctions.js';

	export let data;
</script>

<svelte:head>
	<title>UUN LMS by Kravtsov D.</title>
</svelte:head>

<FormModal buttonTextCancel="Zrušit" buttonTextConfirm="Potvrdit" />
<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<a href="/" class="text-xl font-bold uppercase">UUN LMS by Kravtsov D.</a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<LightSwitch />
				{#if data?.user}
					<Avatar
						initials={processUserInitials(data?.user?.name)}
						src={data?.avatarSrc}
						background="bg-primary-500"
						class="border-surface-600-300-token w-10 border-2 hover:!border-primary-500"
						cursor="cursor-pointer"
					/>
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		{#if data?.user}
			<MainSidebar userRole={data?.user.role} />
		{/if}
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
