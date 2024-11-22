const Legend = (): JSX.Element => (
  <div
    onContextMenu={(e) => e.preventDefault()}
    className='flex flex-gap-large flex-v-center legend'
  >
    <div>
      <strong>Legend</strong>
    </div>
    <div className='flex flex-gap-small flex-v-center'>
      <div className='seat' /> Available
    </div>
    <div className='flex flex-gap-small flex-v-center'>
      <div className='seat active' /> Selected
    </div>
    <div className='flex flex-gap-small flex-v-center'>
      <div className='seat occupied' /> N/A
    </div>
  </div>
);

export default Legend;
