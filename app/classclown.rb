require 'bundler'
Bundler.setup
require 'sinatra'

class ClassClown < Sinatra::Base

  before do 
    puts settings.public_folder
  end

  get "/" do
    erb :index
  end

  get "/record_result" do
    quiz = params[:quiz_id]
    answer = params[:answer_id]
    puts "Answer Sumbitted: quiz: #{quiz}, answer: #{answer}"
    return 'awesome'
  end
end
