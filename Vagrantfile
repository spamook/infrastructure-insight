servers = {
  "load-balancer" => "192.168.56.10",
  "web-server-1"  => "192.168.56.11",
  "web-server-2"  => "192.168.56.12",
  "app-server"    => "192.168.56.13",
  "backup-server" => "192.168.56.14"
}

Vagrant.configure("2") do |config|

  servers.each do |server_name, server_ip|

    config.vm.define server_name do |node|
      node.vm.box = "ubuntu/jammy64"
      node.vm.hostname = server_name

      node.vm.network "private_network", ip: server_ip


      node.vm.synced_folder ".", "/vagrant"

      node.vm.provider "virtualbox" do |vb|
        vb.name = server_name
        vb.memory = "1024"
        vb.cpus = 1
      end
    end

  end
end

