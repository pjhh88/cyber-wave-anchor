import * as anchor from '@project-serum/anchor'
import { clusterApiUrl, Connection, PublicKey, Keypair, Transaction } from "@solana/web3.js";
import { Token, TOKEN_PROGRAM_ID, MintLayout, AccountLayout } from "@solana/spl-token";
const { SystemProgram } = anchor.web3

describe('cpi', () => {
	// Configure the client to use the local cluster.
	anchor.setProvider(anchor.Provider.env())

	const dao = anchor.workspace.Dao;
	const register = anchor.workspace.Register;

	const key = Uint8Array.from([182,150,222,7,91,100,132,163,126,132,192,174,252,86,128,175,119,194,160,54,184,114,126,120,196,84,73,145,194,4,223,79,81,114,140,35,118,155,201,165,129,171,210,168,11,147,82,133,170,79,244,33,239,13,116,38,28,71,194,81,144,1,104,88])
	const clientWalletAccount = anchor.web3.Keypair.fromSecretKey(key)

	let newDataAccount
	// let connection: Connection
	const GREETING_SIZE = 48
	it('test amu', async () => {
		// Derive the address (public key) of a greeting account from the program so that it's easy to find later.
		const SEED = "11111111112222222222333333333346" // spl token
		// spl token으로 hashing 까지
		newDataAccount = await PublicKey.createWithSeed(
			clientWalletAccount.publicKey,
			SEED,
			dao.programId,
		)
		// console.log(dao.provider.wallet.publicKey.toBase58()) // my wallet
		// console.log(dao.programId.toBase58()), // da programId
		// console.log(newDataAccount.toBase58()) // new Account PubKey

		const dataAccount = await dao.provider.connection.getAccountInfo(newDataAccount)
		if (dataAccount === null) {
			console.log(
				'Creating account',
				newDataAccount.toBase58(),
				'to say hello to',
			)
			const lamports = await dao.provider.connection.getMinimumBalanceForRentExemption(GREETING_SIZE)

			let create_new_acc_dao = new Transaction().add(
				// create account
				SystemProgram.createAccountWithSeed({
					fromPubkey: clientWalletAccount.publicKey,
					basePubkey: clientWalletAccount.publicKey,
					seed: SEED,
					newAccountPubkey: newDataAccount,
					lamports,
					space: GREETING_SIZE,
					programId: dao.programId,
				})
			);

			await dao.provider.send(create_new_acc_dao, [clientWalletAccount]);
		} else {
			console.log('success')
			console.log(dataAccount)
		}
	});
	// it('setup data account and create to dao program', async () => {
	// 	newDataAccount = Keypair.generate();

	// 	const lamports = await connection.getMinimumBalanceForRentExemption(GREETING_SIZE)
	
	// 	let create_mint_tx = new Transaction().add(
	// 	  // create mint account
	// 	  SystemProgram.createAccount({
	// 		fromPubkey: program.provider.wallet.publicKey,
	// 		newAccountPubkey: mint.publicKey,
	// 		space: MintLayout.span,
	// 		lamports: lamports,
	// 		programId: TOKEN_PROGRAM_ID,
	// 	  }),
	// 	  // init mint account
	// 	  Token.createInitMintInstruction(
	// 		TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
	// 		mint.publicKey, // mint pubkey
	// 		6, // decimals
	// 		program.provider.wallet.publicKey, // mint authority
	// 		program.provider.wallet.publicKey // freeze authority (if you don't need it, you can set `null`)
	// 	  )
	// 	);
	
	// 	await program.provider.send(create_mint_tx, [mint]);
	// 	// Add your test here.
	// 	// const tx = await program.rpc.initialize({});
	// 	// console.log("Your transaction signature", tx);
	// 	// console.log(await program.provider.connection.getParsedAccountInfo(mint));
	// 	sender_token = Keypair.generate();
	// 	let create_sender_token_tx = new Transaction().add(
	// 	  // create token account
	// 	  SystemProgram.createAccount({
	// 		fromPubkey: program.provider.wallet.publicKey,
	// 		newAccountPubkey: sender_token.publicKey,
	// 		space: AccountLayout.span,
	// 		lamports: await Token.getMinBalanceRentForExemptAccount(program.provider.connection),
	// 		programId: TOKEN_PROGRAM_ID,
	// 	  }),
	// 	  // init mint account
	// 	  Token.createInitAccountInstruction(
	// 		TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
	// 		mint.publicKey, // mint
	// 		sender_token.publicKey, // token account
	// 		program.provider.wallet.publicKey // owner of token account
	// 	  )
	// 	);
	
	// 	await program.provider.send(create_sender_token_tx, [sender_token]);
	
	// 	receiver = Keypair.generate();
	// 	receiver_token = Keypair.generate();
	// 	let create_receiver_token_tx = new Transaction().add(
	// 	  // create token account
	// 	  SystemProgram.createAccount({
	// 		fromPubkey: program.provider.wallet.publicKey,
	// 		newAccountPubkey: receiver_token.publicKey,
	// 		space: AccountLayout.span,
	// 		lamports: await Token.getMinBalanceRentForExemptAccount(program.provider.connection),
	// 		programId: TOKEN_PROGRAM_ID,
	// 	  }),
	// 	  // init mint account
	// 	  Token.createInitAccountInstruction(
	// 		TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
	// 		mint.publicKey, // mint
	// 		receiver_token.publicKey, // token account
	// 		receiver.publicKey // owner of token account
	// 	  )
	// 	);
	
	// 	await program.provider.send(create_receiver_token_tx, [receiver_token]);
	
	// 	let mint_tokens_tx = new Transaction().add(
	// 	  Token.createMintToInstruction(
	// 		TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
	// 		mint.publicKey, // mint
	// 		sender_token.publicKey, // receiver (sholud be a token account)
	// 		program.provider.wallet.publicKey, // mint authority
	// 		[], // only multisig account will use. leave it empty now.
	// 		2e6 // amount. if your decimals is 8, you mint 10^8 for 1 token.
	// 	  )
	// 	);
	
	// 	await program.provider.send(mint_tokens_tx);
	
	// 	console.log("token balance: ", await program.provider.connection.getTokenAccountBalance(sender_token.publicKey));
	// });
	// it("Performs CPI from register to dao", async () => {
	// 	try{
	// 		// Initialize a new puppet account.
	// 		const newDaoAccount = anchor.web3.Keypair.generate()
	// 		const register = anchor.workspace.Register
	// 		const registerAccount = anchor.web3.Keypair.generate()
	// 		const dao = anchor.workspace.Dao
	// 		const [programSigner, bump] = await anchor.web3.PublicKey.findProgramAddress([newDaoAccount.publicKey.toBuffer()], dao.programId)
	// 		console.log(programSigner.toString())
	// 		//puppet.account.puppetAccount.createProgramAddress({from})
    //   		console.log(newDaoAccount.publicKey.toString())

	// 		console.log(dao.programId.toString())
	// 		console.log(register.programId.toString())

	// 		// Invoke the puppet master to perform a CPI to the puppet.
	// 		await register.rpc.register(new anchor.BN(0), {
	// 			accounts: {
	// 				myAccount: newDaoAccount.publicKey,
	// 				daoProgram: dao.programId,
	// 				authority : provider.wallet.publicKey
	// 			},
	// 			signers:[programSigner]
	// 		})

	// 		// Check the state updated.
	// 		const result = await dao.account.account.fetch(newDaoAccount.publicKey)
	// 		console.log(result["data"])
	// 		expect(result["data"]).toBe(new anchor.BN(0))
	// 		}
	// 		catch(err){
	// 			console.log(err)
	// 			fail(err)
	// 		}
		
	// })
})
