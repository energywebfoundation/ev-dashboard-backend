import {EwFlexApplication} from './application';

export async function migrate(args: string[]) {
  const existingSchema = args.includes('--rebuild') ? 'drop' : 'alter';
  console.log('Migrating schemas (%s existing schema)', existingSchema);

  const app = new EwFlexApplication();
  await app.boot();
  await app.migrateSchema({existingSchema});

  // const offerWindowRepository = await app.getRepository(OfferWindowRepository);
  // let offerWindowTime = new Date();
  // offerWindowTime.setHours(0, 0, 0, 0);
  // for (let i = 0; i < 96; i++) {
  //   offerWindowTime.setMinutes(offerWindowTime.getMinutes() + 15);
  //   let offerWindowEndTime = new Date(offerWindowTime.getTime());
  //   offerWindowEndTime.setMinutes(offerWindowTime.getMinutes() + 15);
  //   // new OfferWindow();
  //   // eslint-disable-next-line @typescript-eslint/no-floating-promises
  //   await offerWindowRepository.create({
  //     start: Number(offerWindowTime.getHours() + '' + offerWindowTime.getMinutes()),
  //     end: Number(offerWindowEndTime.getHours() + '' + offerWindowEndTime.getMinutes()),
  //   });

  // }
  // Connectors usually keep a pool of opened connections,
  // this keeps the process running even after all work is done.
  // We need to exit explicitly.
  process.exit(0);
}

migrate(process.argv).catch(err => {
  console.error('Cannot migrate database schema', err);
  process.exit(1);
});
