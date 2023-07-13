import { useState } from "react"

interface Props {
  data: {
    options?: any,
    [key: string]: any
  }
}

export const DynamicSelect = (props: Props) => {
  const { data } = props;

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [goodreadsUrl, setGoodreadsUrl] = useState("");
  const [currentRoot, setCurrentRoot] = useState(data.options)
  const [selects, setSelects] = useState([{
    options: currentRoot,
    // group: data
  }])

  console.log(selects);


  const handleSelectChange = (currOptions: any, index: number, evt: React.BaseSyntheticEvent) => {
    const selected = evt.target.value
    
    if (index < selects.length) {
      const selCopy = [...selects]
      while (index < selCopy.length - 1) {
        selCopy.pop();
      }
      // setSelects()
    }

    if (!currOptions[selected] || !currOptions[selected].options) {
      setYoutubeUrl(currOptions[selected].youtube);
      setGoodreadsUrl(currOptions[selected].goodread);
    }
    else {
      const nextOptions = currOptions[selected].options
      const newSelects = [...selects, { options: nextOptions }]
      setSelects(newSelects)

    }
  }

  return (
    <div>
      {selects.map((select, index) => {
        return (
          <select key={index} onChange={handleSelectChange.bind(null, select.options, index)}>
            <option></option>
            {
              Object.keys(select.options).map((option, index) => {
                return <option key={index}>{option}</option>
              })
            }
          </select>
        )
      })}
    </div>
  )
}
