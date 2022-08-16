
import { AptosParserRepo, getTypeTagFullname, StructTag, parseTypeTagOrThrow, u8, u64, u128, print, strToU8, u8str, DummyCache, ActualStringClass } from "@manahippo/move-to-ts";
import { AptosAccount, AptosClient, HexString, Types } from "aptos";
import { Command } from "commander";
import { getProjectRepo } from "./";
import * as fs from "fs";
import * as yaml from "yaml";
import * as Coin_list from './coin_list';

export const readConfig = (program: Command) => {
  const {config, profile} = program.opts();
  const ymlContent = fs.readFileSync(config, {encoding: "utf-8"});
  const result = yaml.parse(ymlContent);
  //console.log(result);
  if (!result.profiles) {
    throw new Error("Expect a profiles to be present in yaml config");
  }
  if (!result.profiles[profile]) {
    throw new Error(`Expect a ${profile} profile to be present in yaml config`);
  }
  const url = result.profiles[profile].rest_url;
  const privateKeyStr = result.profiles[profile].private_key;
  if (!url) {
    throw new Error(`Expect rest_url to be present in ${profile} profile`);
  }
  if (!privateKeyStr) {
    throw new Error(`Expect private_key to be present in ${profile} profile`);
  }
  const privateKey = new HexString(privateKeyStr);
  const client = new AptosClient(result.profiles[profile].rest_url);
  const account = new AptosAccount(privateKey.toUint8Array());
  console.log(`Using address ${account.address().hex()}`);
  return {client, account};
}

export async function sendPayloadTx(
  client: AptosClient,
  account: AptosAccount,
  payload: Types.TransactionPayload,
  max_gas=1000
){
  const txnRequest = await client.generateTransaction(account.address(), payload, {max_gas_amount: `${max_gas}`});
  const signedTxn = await client.signTransaction(account, txnRequest);
  const txnResult = await client.submitTransaction(signedTxn);
  await client.waitForTransaction(txnResult.hash);
  const txDetails = (await client.getTransactionByHash(txnResult.hash)) as Types.UserTransaction;
  console.log(txDetails);
}

const program = new Command();

program
  .name('yarn cli')
  .description('Move TS CLI generated by move-to-ts')
  .requiredOption('-c, --config <path>', 'path to your aptos config.yml (generated with "aptos init")')
  .option('-p, --profile <PROFILE>', 'aptos config profile to use', 'default')


const coin_list_add_extension = async (CoinType: string, key: string, value: string) => {
  const {client, account} = readConfig(program);
  const CoinType_ = parseTypeTagOrThrow(CoinType);
  const key_ = new ActualStringClass({bytes: strToU8(key)}, parseTypeTagOrThrow('0x1::string::String'));
  const value_ = new ActualStringClass({bytes: strToU8(value)}, parseTypeTagOrThrow('0x1::string::String'));
  const payload = Coin_list.Coin_list.buildPayload_add_extension(key_, value_, [CoinType_]);
  await sendPayloadTx(client, account, payload);
}

program
  .command("coin-list:add-extension")
  .description("")
  .argument('<TYPE_CoinType>')
  .argument('<key>')
  .argument('<value>')
  .action(coin_list_add_extension);


const coin_list_add_to_list = async (CoinType: string) => {
  const {client, account} = readConfig(program);
  const CoinType_ = parseTypeTagOrThrow(CoinType);
  const payload = Coin_list.Coin_list.buildPayload_add_to_list([CoinType_]);
  await sendPayloadTx(client, account, payload);
}

program
  .command("coin-list:add-to-list")
  .description("")
  .argument('<TYPE_CoinType>')
  .action(coin_list_add_to_list);


const coin_list_add_to_registry_by_signer = async (CoinType: string, name: string, symbol: string, coingecko_id: string, logo_url: string, project_url: string, is_update: string) => {
  const {client, account} = readConfig(program);
  const CoinType_ = parseTypeTagOrThrow(CoinType);
  const name_ = new ActualStringClass({bytes: strToU8(name)}, parseTypeTagOrThrow('0x1::string::String'));
  const symbol_ = new ActualStringClass({bytes: strToU8(symbol)}, parseTypeTagOrThrow('0x1::string::String'));
  const coingecko_id_ = new ActualStringClass({bytes: strToU8(coingecko_id)}, parseTypeTagOrThrow('0x1::string::String'));
  const logo_url_ = new ActualStringClass({bytes: strToU8(logo_url)}, parseTypeTagOrThrow('0x1::string::String'));
  const project_url_ = new ActualStringClass({bytes: strToU8(project_url)}, parseTypeTagOrThrow('0x1::string::String'));
  const is_update_ = is_update=='true';
  const payload = Coin_list.Coin_list.buildPayload_add_to_registry_by_signer(name_, symbol_, coingecko_id_, logo_url_, project_url_, is_update_, [CoinType_]);
  await sendPayloadTx(client, account, payload);
}

program
  .command("coin-list:add-to-registry-by-signer")
  .description("")
  .argument('<TYPE_CoinType>')
  .argument('<name>')
  .argument('<symbol>')
  .argument('<coingecko_id>')
  .argument('<logo_url>')
  .argument('<project_url>')
  .argument('<is_update>')
  .action(coin_list_add_to_registry_by_signer);


const coin_list_create_list = async () => {
  const {client, account} = readConfig(program);

  const payload = Coin_list.Coin_list.buildPayload_create_list();
  await sendPayloadTx(client, account, payload);
}

program
  .command("coin-list:create-list")
  .description("")

  .action(coin_list_create_list);


const coin_list_drop_extension = async (CoinType: string, key: string, value: string) => {
  const {client, account} = readConfig(program);
  const CoinType_ = parseTypeTagOrThrow(CoinType);
  const key_ = new ActualStringClass({bytes: strToU8(key)}, parseTypeTagOrThrow('0x1::string::String'));
  const value_ = new ActualStringClass({bytes: strToU8(value)}, parseTypeTagOrThrow('0x1::string::String'));
  const payload = Coin_list.Coin_list.buildPayload_drop_extension(key_, value_, [CoinType_]);
  await sendPayloadTx(client, account, payload);
}

program
  .command("coin-list:drop-extension")
  .description("")
  .argument('<TYPE_CoinType>')
  .argument('<key>')
  .argument('<value>')
  .action(coin_list_drop_extension);


const coin_list_initialize = async () => {
  const {client, account} = readConfig(program);

  const payload = Coin_list.Coin_list.buildPayload_initialize();
  await sendPayloadTx(client, account, payload);
}

program
  .command("coin-list:initialize")
  .description("")

  .action(coin_list_initialize);


const coin_list_remove_from_list = async (CoinType: string) => {
  const {client, account} = readConfig(program);
  const CoinType_ = parseTypeTagOrThrow(CoinType);
  const payload = Coin_list.Coin_list.buildPayload_remove_from_list([CoinType_]);
  await sendPayloadTx(client, account, payload);
}

program
  .command("coin-list:remove-from-list")
  .description("")
  .argument('<TYPE_CoinType>')
  .action(coin_list_remove_from_list);


const devnet_coins_deploy = async () => {
  const {client, account} = readConfig(program);

  const payload = Coin_list.Devnet_coins.buildPayload_deploy();
  await sendPayloadTx(client, account, payload);
}

program
  .command("devnet-coins:deploy")
  .description("Register devnet coins")

  .action(devnet_coins_deploy);


const devnet_coins_mint_to_wallet = async (CoinType: string, amount: string) => {
  const {client, account} = readConfig(program);
  const CoinType_ = parseTypeTagOrThrow(CoinType);
  const amount_ = u64(amount);
  const payload = Coin_list.Devnet_coins.buildPayload_mint_to_wallet(amount_, [CoinType_]);
  await sendPayloadTx(client, account, payload);
}

program
  .command("devnet-coins:mint-to-wallet")
  .description("")
  .argument('<TYPE_CoinType>')
  .argument('<amount>')
  .action(devnet_coins_mint_to_wallet);


const coin_list_fetch_all_registered_coin_info = async () => {
  const {client, account} = readConfig(program);
  const repo = getProjectRepo();
  const value = await Coin_list.Coin_list.query_fetch_all_registered_coin_info(client, account, repo, [])
  print(value);
}

program
  .command("coin-list:query-fetch-all-registered-coin-info")

  .action(coin_list_fetch_all_registered_coin_info)


const coin_list_fetch_full_list = async (list_owner_addr: string) => {
  const {client, account} = readConfig(program);
  const repo = getProjectRepo();
  const value = await Coin_list.Coin_list.query_fetch_full_list(client, account, repo, new HexString(list_owner_addr), [])
  print(value);
}

program
  .command("coin-list:query-fetch-full-list")
  .argument('<list_owner_addr>')
  .action(coin_list_fetch_full_list)




program.parse();