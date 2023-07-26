import './App.css'
import { useState, useRef } from 'react'
import Pdf from "react-to-pdf"

const getFirstDateofMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

const getLastDateofMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

const RESET_DATA = {
  name: '{{NOMBRE}}',
  address: '{{DIRECCION}}',
  invoiceId: 1,
  date: new Date().toLocaleDateString(),
  toName: '{{EMPRESA}}',
  toAddress: '{{DIRECCION}}',
  itemDescription: `Servicios Profesionales ( ${getFirstDateofMonth(new Date()).toLocaleDateString()} - ${getLastDateofMonth(new Date()).toLocaleDateString()} )`,
  itemAmount: 0,
  month: new Date().toLocaleDateString('es-AR', { month: 'long' }),
}

function App() {
  const ref = useRef(null);

  const [data, setData] = useState<typeof RESET_DATA>( () => {
    const localData = localStorage.getItem('data')
    return localData ? JSON.parse(localData) : RESET_DATA
  })
  const [saved, setSaved] = useState(true)

  const handleCreateNextInvoice = () => {
    const nextInvoiceId = data.invoiceId + 1
    setData({...data, 
      invoiceId: nextInvoiceId, 
      date: new Date().toLocaleDateString(),
      itemDescription: `Servicios Profesionales ( ${getFirstDateofMonth(new Date()).toLocaleDateString()} - ${getLastDateofMonth(new Date()).toLocaleDateString()} )`
    })
    setSaved(false)
  }

  const handleChange = (key: string, text: string ) => {
    setData({...data, [key]: text})
    setSaved(false)
  }

  const handleSave = () => {
    localStorage.setItem('data', JSON.stringify(data))
    setSaved(true)
  }

  return (
    <>
    <div className='tools'>
      <button onClick={() => setData(RESET_DATA)}>Reset</button>
      <button onClick={() => handleCreateNextInvoice()}>Next Invoice</button>
      <button onClick={() => handleSave()}>Save</button>
      <Pdf targetRef={ref} filename={`Invoice-N${data.invoiceId}-${data.name.toUpperCase()}-${data.date}.pdf`}>
        {({ toPdf }: { toPdf: () => void}) => <button onClick={toPdf}>Generate Pdf</button>}
      </Pdf>
      {saved ? <span className='notification saved'>Saved</span> : <span className='notification not-saved'>Not Saved</span>}
    </div>
    <div className='app' ref={ref}>
      <header>
        <h1>FACTURA</h1>
        <div className='box'>
          <div className='row'>
            <span>Nombre</span><span contentEditable={true} onBlur={e => handleChange('name',e.currentTarget.textContent!)}>{data.name || '-'}</span>
          </div>
          <div className='row'>
            <span>Direccion</span><span contentEditable={true} onBlur={e => handleChange('address',e.currentTarget.textContent!)}>{data.address || '-'}</span>
          </div>
        </div>
      </header>
      <main>
        <div className='date-invoice'>
          <div className='box bo-sm'>
            <div className='row'>
              <span>ID de factura</span><span contentEditable={true} onBlur={e => handleChange('invoiceId',e.currentTarget.textContent!)}>{data.invoiceId || '-'}</span>
            </div>
            <div className='row'>
              <span>Fecha</span><span contentEditable={true} onBlur={e => handleChange('date',e.currentTarget.textContent!)}>{data.date || '-'}</span>
            </div>
          </div>
          <div className='box'>
            <div className='row'>
              <span>Para</span>
              <div>
                <b className='text-left inline' contentEditable={true} onBlur={e => handleChange('toName',e.currentTarget.textContent!)}>{data.toName || '-'}</b>
                <span className='inline' contentEditable={true} onBlur={e => handleChange('toAddress',e.currentTarget.textContent!)}>{data.toAddress || '-'}</span>
              </div>
            </div>
          </div>
        </div>
        <table className='text-left'>
          <thead>
            <tr className='cell-sm'>
              <th className='r b'></th>
              <th className='r b'>Descripcion</th>
              <th className='b'>Monto</th>
            </tr>
          </thead>
          <tbody>
            <tr className='cell-md'>
              <td className='r b'>Servicio</td>
              <td className='r b' contentEditable={true} onBlur={e => handleChange('itemDescription',e.currentTarget.textContent!)}>{data.itemDescription || '-'}</td>
              <td className='b' contentEditable={true} onBlur={e => handleChange('itemAmount',e.currentTarget.textContent!)}>{data.itemAmount || '-'}</td>
            </tr>
          </tbody>
        </table>
        <span className='amount'>Monto a pagar {data.itemAmount || '-'}</span>
      </main>
    </div>
    </>
  )
}

export default App
