require 'bundler'
Bundler.setup

require 'sinatra'
require 'active_support'
require 'json'
require 'pusher'
require 'digest/md5'

class ClassClown < Sinatra::Base
  helpers do
    def push(queue, message)
      begin
        Pusher["classclown"].trigger(queue, message.to_json)
      rescue Pusher::ConfigurationError
        puts "you forgot to setup Pusher"
      end
    end
  end

  get "/" do
    erb :index
  end

  get "/answer_question" do
    question_text = params[:question_text]
    question_id = Digest::MD5.digest question_text
    answer = params[:answer]
    startPoll = {
      :command => "startPoll",
      :question => question_text,
      :question_id => question_id,
      :answers => [
        {"name" => "A" , "answer" => "First answer"},
        {"name" => "B" , "answer" => "Also an answer"},
        {"name" => "C" , "answer" => "Third answer"}
      ],
      "correct" => "C"
    }

    answer = {
      :command => "addAnswer",
      :answer => answer,
      :question_id => question_id
    }

    push(:event, startPoll)
    push(:event, answer)

    content_type 'image/gif'
    return File.read(File.join(settings.public_folder, "pixel.gif"))
  end

end
