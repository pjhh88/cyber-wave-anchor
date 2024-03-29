use anchor_lang::prelude::*;

declare_id!("3Kxeg4njnqwswLdBdqmfnGVdctSddVXU4Ti5VFEyZ8wC");

#[program]
pub mod wave_size_calculation {
	use super::*;

	pub fn size_calculate(ctx: Context<WaveSizeCalc>, power_all: u32, random1: u32, random2: u32, random3: u32, random4: u32) -> ProgramResult {

		const POWER_CONST_PERCENT: u32 = 70;
		let account_data = &mut ctx.accounts.central_region_account;
		let region_1_power = random1 * power_all / 100;
		let region_2_power = random2 * power_all / 100;
		let region_3_power = random3 * power_all / 100;
		let region_4_power = random4 * power_all / 100;
		account_data.region_1_power = region_1_power * POWER_CONST_PERCENT / 100;
		account_data.region_2_power = region_2_power * POWER_CONST_PERCENT / 100;
		account_data.region_3_power = region_3_power * POWER_CONST_PERCENT / 100;
		account_data.region_4_power = region_4_power * POWER_CONST_PERCENT / 100;

		Ok(())
	}

	pub fn set_region_data(ctx: Context<SetRegionData>, data: RegionInfo) -> ProgramResult {
		let account_data = &mut ctx.accounts.account;
		account_data.region_1_power = data.region_1_power;
		account_data.region_2_power = data.region_2_power;
		account_data.region_3_power = data.region_3_power;
		account_data.region_4_power = data.region_4_power;
		Ok(())
	}

	pub fn initialize(_ctx: Context<Initialize>) -> ProgramResult {
		Ok(())
	}
}

#[account]
pub struct RegionResultInfo {
	pub region_1_result: u32,
	pub region_2_result: u32,
	pub region_3_result: u32,
	pub region_4_result: u32,
}

#[account]
pub struct RegionInfo {
	pub region_1_power: u32,
	pub region_2_power: u32,
	pub region_3_power: u32,
	pub region_4_power: u32,
}

#[derive(Accounts)]
pub struct SetRegionData<'info> {
	#[account(mut)]
	pub account: Account<'info, RegionInfo>,
}

#[derive(Accounts)]
pub struct WaveSizeCalc<'info> {
	#[account(mut)]
	pub central_region_account: Account<'info, RegionInfo>
}

#[derive(Accounts)]
pub struct Initialize<'info> {
	#[account(zero)]
	pub my_account: Account<'info, RegionInfo>,
	#[account(mut)]
	pub user: Signer<'info>,
	pub system_program: Program<'info, System>,
}