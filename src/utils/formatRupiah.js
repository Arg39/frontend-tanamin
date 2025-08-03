export function formatRupiah(price) {
  if (typeof price !== 'number') {
    price = Number(price);
  }
  if (isNaN(price)) return '';
  return 'Rp. ' + price.toLocaleString('id-ID');
}
