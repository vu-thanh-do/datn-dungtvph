import * as XLSX from 'xlsx'

export const exportToExcel = (data: (string | undefined)[][], title: string) => {
  const ws = XLSX.utils.aoa_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws)
  XLSX.writeFile(wb, `${title}.xlsx`)
}
