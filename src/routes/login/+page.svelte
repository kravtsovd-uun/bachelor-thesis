<div class="flex h-full w-full flex-col items-center pt-12">
	<h2 class="text-base-content h2 text-center text-3xl font-bold tracking-tight">
		Přihláste se, prosím
	</h2>
	<p class="mt-1 text-center">
		Nebo <a href="/register" class="font-medium text-primary-500 hover:cursor-pointer"
			>si zaregistrujte účet
		</a> pokud ho ještě nemáte.
	</p>
	<div class="mt-6 w-full max-w-sm rounded-lg bg-primary-50 py-6 shadow-md">
		<form method="POST" action="?/login" class="flex w-full flex-col items-center space-y-2">
			<div class="form-control w-full max-w-xs">
				<label for="email" class="label pb-1 font-medium text-black">
					<span class="label-text">Email</span>
				</label>
				<input type="email" name="email" class="input-bordered input w-full max-w-xs" />
			</div>
			<div class="form-control w-full max-w-xs">
				<label for="password" class="label pb-1 font-medium text-black">
					<span class="label-text">Heslo</span>
				</label>
				<input type="password" name="password" class="input-bordered input w-full max-w-xs" />
			</div>
			<div class="w-full max-w-xs pt-3">
				<button class="variant-filled-primary btn w-full max-w-xs">Přihlásit se</button>
			</div>
		</form>
	</div>
</div>
