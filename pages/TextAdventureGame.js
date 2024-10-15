import React, {useState} from 'react';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {ScrollArea} from '@/components/ui/scroll-area';
import {
  Card,
  CardContent,
} from '@/components/ui/card';

const TextAdventureGame = () => {
  const rooms = {
    start: {
      description: 'You are in a small, dimly lit room. There\'s a hallway to the north.',
      search_description: 'You see a lantern lighting the hallway with a dim, yellow light. Ancient dust curls around your feet as you walk. Otherwise, there is nothing of note. \n Strange though. If there\'s a lit lantern, why are there no footsteps in the dust?',
      exits: { north: 'hallway' },
      items: [],
    },
    hallway: {
      description: 'You are in a long hallway. A few lanterns hang from the walls. There\'s a balcony to the east and a locked library to the north.',
      search_description: 'More dust, but not as much as in the entrance. As you scan the room, you see some books piled in the corner.',
      exits: { south: 'start', east: 'balcony', north: 'library' },
      items: ['book'],
    },
    balcony: {
      description: 'You are on a quiet balcony overlooking a garden. The hallway is west.',
      search_description: 'There are some pots on the balcony with dead flowers. Something catches your eye; Light from the hallway behind you reveals the faint, gold sparkle of a key hidden in the dead plants!',
      exits: { west: 'hallway' },
      items: ['key'],
    },
    library: {
      description: 'You are in a dusty library. There\'s a chest here.',
      search_description: 'Other than the chest, a desk, and some dusty tomes, there\'s nothing else. The chest looks untouched for many years.',
      exits: { south: 'hallway' },
      items: ['chest'],
      locked: true,
    },
  };

  const [currentRoom, setCurrentRoom] = useState('start');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState(['Welcome to the adventure game! Type commands to explore.']);
  const [inventory, setInventory] = useState([]);
  const [chestUnlocked, setChestUnlocked] = useState(false);
  const [libraryUnlocked, setLibraryUnlocked] = useState(false);

  const commandKey = ['look', 'move [direction]', 'take [item]', 'inventory', 'read', 'search', 'unlock [object]'];

  const handleCommand = () => {
    const trimmedInput = input.trim().toLowerCase();
    const commandParts = trimmedInput.split(' ');
    const command = commandParts[0];
    const argument = commandParts.slice(1).join(' ');

    let newOutput = '';

    switch (command) {
      case 'look':
        newOutput = rooms[currentRoom].description;
        break;

      case 'move':
        if (rooms[currentRoom].exits[argument]) {
          if (argument === 'north' && currentRoom === 'hallway' && !libraryUnlocked) {
            newOutput = 'The library is locked. You might need to find something to unlock it.';
          } else {
            setCurrentRoom(rooms[currentRoom].exits[argument]);
            newOutput = `You moved to the ${rooms[currentRoom].exits[argument]}.`;
          }
        } else {
          newOutput = 'You can\'t go that way.';
        }
        break;

      case 'take':
        if (rooms[currentRoom].items.includes(argument)) {
          setInventory([...inventory, argument]);
          newOutput = `You took the ${argument}.`;
          rooms[currentRoom].items = rooms[currentRoom].items.filter(item => item !== argument);
        } else {
          newOutput = `There's no ${argument} here.`;
        }
        break;

      case 'inventory':
        newOutput = inventory.length > 0 ? `You have: ${inventory.join(', ')}` : 'Your inventory is empty.';
        break;

      case 'read':
        if (inventory.includes('book')) {
          if (currentRoom === 'hallway') {
            setLibraryUnlocked(true);
            newOutput = 'You read the book and feel enlightened. The library door creaks open.';
          } else {
            newOutput = 'You start to read the book, but as you read, the words disappear. Strange.';
          }
        } else {
          newOutput = "You don't have anything to read.";
        }
        break;
      
      case 'search':
        newOutput = rooms[currentRoom].search_description;
        break;

      case 'unlock':
        if (argument === 'chest' && currentRoom === 'library' && inventory.includes('key')) {
          setChestUnlocked(true);
          newOutput = 'You unlocked the chest! Inside, you find treasure of gold, a few gems, and scrolls! Congratulations!';
        } else {
          newOutput = 'You can\'t unlock that.';
        }
        break;

      default:
        newOutput = 'Unknown command.';
        break;
    }

    setOutput([...output, `> ${input}`, newOutput]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-800 text-white game-wrapper">
      <div className="flex-1 flex flex-col space-y-4 game-screen">
        <ScrollArea className="h-72 flex-1 bg-gray-900 p-4 rounded-md">
              {output.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
        </ScrollArea>

        <Card className="bg-gray-700 p-4">
          <CardContent>
            <h2 className="text-lg font-semibold">Command Key</h2>
            <ul className="list-disc list-inside">
              {commandKey.map((cmd, index) => (
                <li key={index}>{cmd}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your command..."
            className="flex-grow"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCommand();
            }}
          />
          <Button onClick={handleCommand}>Go</Button>
        </div>
      </div>
    </div>
  );
};

export default TextAdventureGame;
