<div class="flex h-full w-full flex-col items-center pt-12">
	<h2 class="text-base-content h2 text-center text-3xl font-bold tracking-tight">
		Zaregistrujte si účet
	</h2>
	<p class="mt-1 text-center">
		Nebo <a href="/login" class="font-medium text-primary-500 hover:cursor-pointer"
			>se přihláste
		</a> pokud již účet máte.
	</p>
	<div class="mt-6 w-full max-w-sm rounded-lg bg-primary-50 py-6 shadow-md">
		<form method="POST" action="?/register" class="flex w-full flex-col items-center space-y-2">
			<div class="form-control w-full max-w-xs">
				<label for="name" class="label pb-1 font-medium text-black">
					<span class="label-text">Jméno</span>
				</label>
				<input type="text" name="name" class="input-bordered input w-full max-w-xs" />
			</div>
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
			<div class="form-control w-full max-w-xs">
				<label for="passwordConfirm" class="label pb-1 font-medium text-black">
					<span class="label-text">Potvrzení hesla</span>
				</label>
				<input
					type="password"
					name="passwordConfirm"
					class="input-bordered input w-full max-w-sm"
				/>
			</div>
			<div class="w-full max-w-xs pt-3">
				<button class="variant-filled-primary btn w-full max-w-xs">Registrovat</button>
			</div>
		</form>
	</div>
	<div class="mt-16 w-full max-w-sm rounded-lg bg-primary-50 p-6">
		<h3 class="h3 font-bold text-primary-900">Pozor</h3>
		<hr class="my-2" />
		<p class="text-primary-800">
			Pro registraci účtu školy kontaktujte prosím správce systému
		</p>
	</div>
</div>
