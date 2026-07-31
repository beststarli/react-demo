import './App.css'
import CountDown from './demo/countDown'
import beststar from '/beststar.png'

function App() {
	return (
		// <div className='h-screen w-screen items-center justify-center flex'>
		// 	<div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
		// 		<h1 className="text-3xl font-bold text-center text-blue-600 mb-4">
		// 			Welcome to the Basic React Scaffold
		// 		</h1>
		// 		<p className="text-lg text-gray-700 mb-6">
		// 			This project is a modern web application scaffold built with a powerful and efficient technology stack:
		// 		</p>
		// 		<ul className="list-disc list-inside text-gray-600 mb-6">
		// 			<li><strong>React</strong>: A JavaScript library for building user interfaces.</li>
		// 			<li><strong>Tailwind CSS</strong>: A utility-first CSS framework for rapid styling.</li>
		// 			<li><strong>shadcn/ui</strong>: Reusable, customizable UI components for React.</li>
		// 			<li><strong>TypeScript</strong>: Adds static types to JavaScript for improved developer experience.</li>
		// 			<li><strong>Vite</strong>: A fast, modern build tool for frontend development.</li>
		// 		</ul>
		// 		<footer className="flex flex-col items-center space-y-4 text-center text-gray-500">
		// 			<p className="text-xs">
		// 				Scaffolded with <code className="bg-gray-200 px-1 rounded">npm create @beststar/react-scaffold my-app</code>
		// 			</p>
		// 			<div>
		// 				Provided by <strong>BestStar</strong>. Visit my GitHub at{' '}
		// 				<a
		// 					href="https://github.com/BestStarLi"
		// 					className="text-blue-500 hover:underline"
		// 					target="_blank"
		// 					rel="noopener noreferrer"
		// 				>
		// 					github.com/BestStarLi
		// 				</a>.
		// 			</div>
		// 			<a
		// 				href="https://github.com/BestStarLi"
		// 				target="_blank"
		// 				rel="noopener noreferrer"
		// 			>
		// 				<img
		// 					src={beststar}
		// 					alt="BestStar GitHub"
		// 					className="w-12 h-12 mx-auto hover:opacity-80 transition-opacity rounded-full border-4 border-gray-300"
		// 				/>
		// 			</a>
		// 		</footer>
		// 	</div>
		// </div>
		<div className='h-screen w-screen flex items-center justify-center'>
			<CountDown />
		</div>
	)
}

export default App
