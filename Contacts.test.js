import {render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {act} from 'react-dom/test-utils'
import App from '../App';

function setup(jsx) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  }
}

describe("Contacts", () => {
  it("renders 'Видалити канал' buttons correctly after 3 clicks on 'Додати канал зв'язку'", async () => {    
    render(<App />);
    const addButton = screen.queryByTestId("add-button");
    act(() => addButton.click());
    act(() => addButton.click());
    act(() => addButton.click());     

    let deleteElement = await screen.findAllByText(/Видалити канал/i);

    expect(deleteElement.length).toBe(3);    
  })

  it("renders select lists correctly after 3 clicks on 'Додати канал зв'язку'", async () => {    
    render(<App />);
    const addButton = screen.queryByTestId("add-button");
    act(() => addButton.click());
    act(() => addButton.click());
    act(() => addButton.click());    

    const selectLists = screen.queryAllByRole('combobox'); 

    expect(selectLists).toHaveLength(4); 
  })

  it("renders text areas correctly after 2 clicks on 'Додати канал зв'язку'", async () => {    
    render(<App />);
    const addButton = screen.queryByTestId("add-button");
    act(() => addButton.click());
    act(() => addButton.click());        

    const textareas = screen.queryAllByRole('textbox'); 

    expect(textareas).toHaveLength(3); 
  })

  it(`renders 'Видалити канал' buttons correctly  after 3 clicks on 'Додати канал зв'язку and 1 click on 'Видалити канал''`
  , async () => {    
    render(<App />);
    const addButton = screen.queryByTestId("add-button");
    act(() => addButton.click());
    act(() => addButton.click());
    act(() => addButton.click());     

    let deleteElement = await screen.findAllByText(/Видалити канал/i);

    act(() => deleteElement[1].click());
    deleteElement = await screen.findAllByText(/Видалити канал/i);

    expect(deleteElement.length).toBe(2);    
  })

  it(`deletes correctly the last channel`, async () => {    
    const {user} =  setup(<App />);
    const addButton = screen.queryByTestId("add-button");
    
    act(() => addButton.click());
    act(() => addButton.click());    
    let selectLists = screen.getAllByRole('combobox');    
    let optionsTelegram = screen.getAllByText('Telegram')
    await act(async() => user.selectOptions(selectLists[2], optionsTelegram[2]))
    let deleteElement = (await screen.findAllByText(/Видалити канал/i))[0];
    act(() => deleteElement.click());
  
    expect((screen.getAllByText('Telegram')[1]).selected).toBe(true)  
  })

  it(`deletes correctly not last channel`, async () => {    
    const {user} =  setup(<App />);
    const addButton = screen.queryByTestId("add-button");
    
    act(() => addButton.click());
    act(() => addButton.click());    
    let contactDatas = screen.getAllByRole('textbox');   
    await act(async() => user.type(contactDatas[2], '@username'))
    let deleteElement = (await screen.findAllByText(/Видалити канал/i))[0];
    act(() => deleteElement.click());
  
    expect((screen.getAllByRole('textbox')[1]).value).toBe('@username')  
    expect((screen.getAllByRole('textbox')[0]).value).toBe('')
  })
})

describe("Statistics", () => {
  it(`displays correctly information about the channels count`, async () => {    
    render(<App />);
    const addButton = screen.queryByTestId("add-button");    
    act(() => addButton.click());
    act(() => addButton.click()); 
    act(() => addButton.click());
    act(() => addButton.click());   
    let deleteElement = (await screen.findAllByText(/Видалити канал/i))[0];
    act(() => deleteElement.click());
  
    expect(screen.getByTestId('statistics')).toHaveTextContent('Count of channels: 4')  
  })

  it(`displays correctly information about the channel type of the last channel`, async () => {    
    const {user} =  setup(<App />);
    const addButton = screen.queryByTestId("add-button");
    
    act(() => addButton.click());
    act(() => addButton.click());    
    let selectLists = screen.getAllByRole('combobox');    
    let optionsTelegram = screen.getAllByText('Viber')
    await act(async() => user.selectOptions(selectLists[2], optionsTelegram[2]))
  
    expect(screen.getByTestId('statistics')).toHaveTextContent(/your last channel is: Viber/i) 
  })

  it(`does not display information about the channel type if type is not selected in the last channel`
  , async () => {    
    const {user} =  setup(<App />);
    const addButton = screen.queryByTestId("add-button");
    
    act(() => addButton.click());
    act(() => addButton.click());    
    let selectLists = screen.getAllByRole('combobox');    
    let optionsTelegram = screen.getAllByText('Viber')
    await act(async() => user.selectOptions(selectLists[2], optionsTelegram[2]))
    let deleteElement = (await screen.findAllByText(/Видалити канал/i))[1];
    act(() => deleteElement.click());
  
    expect(screen.getByTestId('statistics')).not.toHaveTextContent(/your last channel is/i) 
  })  
})

describe("Rerendering", () => {
  it(`check if render is called for added ContactItem only`
  , async () => {    
    render(<App />);
    const addButton = screen.queryByTestId("add-button");
    
    act(() => addButton.click());
    act(() => addButton.click());
    const consoleLogSpy = jest.spyOn(console, 'log')
    act(() => addButton.click());    
    
    
  
    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).toHaveBeenLastCalledWith("child render", 3)
    consoleLogSpy.mockRestore();
    
  })

  it(`check if render is called for modified ContactItem only`
  , async () => {    
    const {user} =  setup(<App />);
    const addButton = screen.queryByTestId("add-button");
    
    act(() => addButton.click());
    act(() => addButton.click());
    act(() => addButton.click());    
    
    let selectLists = screen.getAllByRole('combobox');    
    let optionsTelegram = screen.getAllByText('Telegram')
    const consoleLogSpy2 = jest.spyOn(console, 'log')
    await act(async() => user.selectOptions(selectLists[2], optionsTelegram[2]))
    
    expect(consoleLogSpy2).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy2).toHaveBeenLastCalledWith("child render", 2)
    consoleLogSpy2.mockRestore();
  }) 
})
