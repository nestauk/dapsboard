<script>
	import {_screen, Banner} from '@svizzle/ui';
	// FIXME Consider RFC 5322 compliant email validation
	import emailRegex from 'email-regex';

	import InputWidget from '$lib/app/components/svizzle/InputWidget.svelte';

	import {
		_isAuthModalOpen,
		_credentials
	} from '$lib/app/stores/auth.js';
    import {requestNestaToken} from '$lib/app/utils/auth.js';

	let submittedEmail;
	let message;

	const validEmailRegex = emailRegex({exact: true});
	const validateEmail = email => validEmailRegex.test(email);
	const validateToken = token => token.match(/^[0-9a-f]{32}$/ui);

	const onEmailSubmitted = async ({detail: email}) => {
		const result = await requestNestaToken(email);

		if (result.error) {
			message = result.error;
			return;
		} else {
			submittedEmail = email;
			message = 'Token sent to your email. Paste it above to authenticate.';
		}
	};

	const closeModal = () => {
		$_isAuthModalOpen = false;
	};

	const onTokenSubmitted = ({detail: token}) => {
		$_credentials = {email: submittedEmail, token};
		message = 'Authenticated. You can now query the backend.';
		setTimeout(closeModal, 2000);
	};

	$: console.log('credentials', $_credentials);
</script>

<Banner
	on:close
	{_screen}
>
	<div class='content'>
		<h1>Authenticate</h1>
		<p>
			To use this feature you need to authenticate with your Nesta email.
			Please request a token and paste it below once retrieved from your
			mailbox.
		</p>
		<div class='form'>
			<InputWidget
				buttonText='Request'
				on:valueSubmitted={onEmailSubmitted}
				placeholder='Please input your email address'
				validateValue={validateEmail}
			/>
			<InputWidget
				buttonText='Authenticate'
				on:valueSubmitted={onTokenSubmitted}
				placeholder='Please paste your token here'
				validateValue={validateToken}
			/>
		</div>
		{#if message}
			<div class='messages'>
				{message}
			</div>
		{/if}
	</div>
</Banner>

<style>
	.content {
		margin: 1rem;
		max-width: 100%;
	}
	.form {
		margin: 1rem;
		display: grid;
		grid-auto-flow: row;
		grid-gap: 1rem;
	}

	.messages {
		background: rgb(204, 241, 255);
		border: thin solid rgb(0, 153, 255);
		margin: 1rem;
		padding: 1rem;
		border-radius: 0.5rem;
	}
</style>